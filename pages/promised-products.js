import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'

import Layout from '../components/layout'

import { getRecords } from '../lib/airtable'

import PromiseWorker from '../workers/promise.worker'

export async function getStaticProps() {
  const allProducts = await getRecords();
  // console.log("Airtable products for Worker Products page", allProducts.selectedFields);
  const products = allProducts.selectedFields.map(item => item["image"]["url"])
  return { 
    props: {
      products
    }
  }
}

export default function WorkerProducts({ products }) {  
  useEffect( () => {
    // const imgElements = document.querySelectorAll('img[data-src]');
    // const urls = imgElements.map(image => image.getAttribute('data-src'))

    // console.log("products : ", products);

    const resolveImages = urlArray => {
      const createImage = url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve(img);
          }; 
          img.onerror = () => {
            resolve(null);
          };
          img.src = url;
        });
      }
      return new Promise((resolve, reject) => {
        const PromiseLoaderWorker = new PromiseWorker();
        PromiseLoaderWorker.postMessage(urlArray);
        PromiseLoaderWorker.addEventListener(
          "message",
          async function(event) {
            const imagePromises = event.data.map(async url => {
              if (url) {
                return await createImage(url);
              }
            });
            const imageElements = await Promise.all(imagePromises);
            resolve(imageElements.filter(Boolean));
          },
          false
        );
      });
    };

    const start = () => {
      const imageFragment = document.createDocumentFragment();
      const container = document.getElementById("collage");
      resolveImages(products).then((imgs) => {
        imgs.forEach(i => {
          imageFragment.appendChild(i)
        });
        container.appendChild(imageFragment)
      }, () => {})
    }

    start()

  }, [])

  return (
    <Layout>
      <Head>
        <title>Produits chez NBS</title>
        <description>Les images sont enregistrees en static dans le repository github</description>
      </Head>
      <section>
        <h1>Produits avec images en statique</h1>
        <div id="collage"></div>
      </section>
      <Link href="/">
        <a>Home</a>
      </Link>
    </Layout>
  )
}

