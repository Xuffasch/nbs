import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'

import Layout from '../components/layout'

import { getRecords } from '../lib/airtable'

export async function getStaticProps() {
  const allProducts = await getRecords();
  console.log("Airtable products for Sequence Products page", allProducts.selectedFields);
  return { 
    props: {
     allProducts
    }
  }
}

export default function SequenceProducts({ allProducts }) {  
  useEffect( () => {
    const imgElements = document.querySelectorAll('img[data-src]');
    console.log("Sequence Products img tags : ", imgElements)

    const preload = (imageArray, i) => {
      let ind = i || 0;
      if (imageArray && imageArray.length > ind) {
        imageArray[ind].onload = function() {
          preload(imageArray, ind + 1);
        }
        imageArray[ind].src = imageArray[ind].getAttribute('data-src');
      }
    }

    preload(imgElements);

  }, [])

  return (
    <Layout>
      <Head>
        <title>Produits chez NBS</title>
        <description>Les images sont enregistrees en static dans le repository github</description>
      </Head>
      <section>
        <h1>Produits avec images en statique</h1>
        <ul>
          {allProducts.selectedFields.map(p => {
            let imageData = p.image
            console.log("listed product url : ", imageData.url)
            return (
              <li key={p.id}>
                {p.animal}
                <br />
                <img data-src={`${imageData.url}`} alt={`${p.animal}`} width="300" height="200" />
              </li>
            )
          })}
        </ul>
      </section>
      <Link href="/">
        <a>Home</a>
      </Link>
    </Layout>
  )
}

