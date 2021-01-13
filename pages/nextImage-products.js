import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import Layout from '../components/layout'

import { getRecords } from '../lib/airtable'

export async function getStaticProps() {
  const allProducts = await getRecords();
  return { 
    props: {
     allProducts
    }
  }
}

export default function Products({ allProducts }) {
  return (
    <Layout>
      <Head>
        <title>Produits chez nde NBS</title>
        <description>Les produits francais de NBS en cette saison des fetes de fin d'année 2020</description>
      </Head>
      <section>
        <h1>Bonnes fetes de fin d'année 2020</h1>
      </section>
      <ul>
        {allProducts.selectedFields.map(p => 
          {
            let imageData = p.image
            return (
              <li key={p.id}>
                {p.animal}
                <br />
                <Image src={`${imageData.url}`} alt={`${p.animal}`} width={300} height={200} />
                {/* <img src={`${imageData.url}`} alt={`${p.animal}`} width="300" height="200" /> */}
                {/* <img data-src={`${imageData.url}`} /> */}
              </li>
            )
          }
        )}
      </ul>
      <Link href="/">
        <a>Home</a>
      </Link>
    </Layout>
  )
}