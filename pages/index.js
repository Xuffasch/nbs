import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../actions'

import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    }
  }
}

const useMemory = () => {
  const count = useSelector((state) => state.count)
  const altMode = useSelector((state) => state.altMode)
  const dispatch = useDispatch()

  const increase = () => dispatch( {type: actions.ADD_COUNTER} )
  const decrease = () => dispatch( {type: actions.DECREASE_COUNTER })
  const changeMode = () => dispatch( {type: actions.CHANGE_MODE})
  
  return { count, altMode, increase, decrease, changeMode }
}

export default function Home({ allPostsData }) {
  const { count, altMode, increase, decrease, changeMode } = useMemory()
  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <meta 
          name="description"
          content="Learn how to build a peersonal website using Next.js"
        />
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I'm programmerrs</p>
        <p>
          (I'm building a webstore with Next.js and offline features)
        </p>
      </section>
      <section>
        <Link href="/nextImage-products">
          <a>Next Image Products Page</a>
        </Link>
        <br />
        <Link href="/static-products">
          <a>Static assets Products Page</a>
        </Link>
        <br />
        <Link href="/worker-products">
          <a>Web worker downloaded Products Page</a>
        </Link>
        <br />
        <Link href="/promised-products">
          <a>Promise based Web worker Products Page</a>
        </Link>
        <br />
        <Link href="/sequence-products">
          <a>Sequentially downloaded Products Page</a>
        </Link>
      </section>

      <section>
          <h1 className={altMode ? "red" : "blue"}>Counter: <span>{count}</span></h1>
          <button onClick={increase}>+1</button>
          <button onClick={decrease}>-1</button>
          <button onClick={changeMode}>Change Color</button>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map( ({id, date, title}) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}


