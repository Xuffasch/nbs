import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import Layout from '../components/layout'

const fs = require('fs')

export async function getStaticProps() {
  let files  = fs.readdirSync('public')
  console.log("current products pictures", files)

  let initialProducts = files.map(item => {
      return /.jpg|.png/g.test(item) ? {
        name: item.slice(0, item.lastIndexOf('.')),
        image: item
      } : null
    }
  ).filter(item => item !== null)

  console.log("initial products : ", initialProducts)

  return {
    props: {
      initialProducts
    }
  }
}

export default function StaticProducts({initialProducts}) {
  return (
    <Layout>
      <Head>
        <title>Produits chez NBS</title>
        <description>Les images sont enregistrees en static dans le repository github</description>
      </Head>
      <section>
        <h1>Produits avec images en statique</h1>
        <ul>
          {initialProducts.map(p => {
            return (
              <li key={`${p.name}`}>
                {p.name}
                <br />
                <Image src={`/${p.image}`} alt={`${p.name}`} width="200" height="200" />
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