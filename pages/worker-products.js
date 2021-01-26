import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'

import Layout from '../components/layout'

import { getRecords } from '../lib/airtable'

import ImageWorker from '../workers/image.worker'

export async function getStaticProps() {
  const allProducts = await getRecords();
  return { 
    props: {
     allProducts
    }
  }
}

export default function WorkerProducts({ allProducts }) {  
  useEffect( () => {
    const ImageLoaderWorker = new ImageWorker();
    const imgElements = document.querySelectorAll('img[data-src]');

    ImageLoaderWorker.addEventListener('message', event => {
      const imageData = event.data
      const imageElement = document.querySelector(`img[data-src='${imageData.imageURL}']`)

      console.log("image tag : ", imageElement)
    
      const objectURL = URL.createObjectURL(imageData.blob)
    
      imageElement.onload = () => {
        imageElement.removeAttribute('data-src')
    
        URL.revokeObjectURL(objectURL)
      }
    
      imageElement.setAttribute('src', objectURL)
    })

    imgElements.forEach(imageElement => {
      const imageURL = imageElement.getAttribute('data-src')
      ImageLoaderWorker.postMessage(imageURL)
    })

    window.addEventListener('unload', () => {
      navigator.serviceWorker.controller.postMessage( { type: "CLOSING" });
    })

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

