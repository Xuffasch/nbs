import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../actions'

import { Workbox } from 'workbox-window'

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
  const count = useSelector( state => state.count)
  const altMode = useSelector( state => state.altMode)
  const sw_on = useSelector( state => state.activate_sw)
  const dispatch = useDispatch()

  const increase = () => dispatch( { type: actions.ADD_COUNTER } )
  const decrease = () => dispatch( { type: actions.DECREASE_COUNTER })
  const changeMode = () => dispatch( { type: actions.CHANGE_MODE } )

  const activate_sw = () => dispatch( { type: actions.USE_SERVICE_WORKER })
  
  return { count, altMode, sw_on, increase, decrease, changeMode, activate_sw }
}

export default function Home({ allPostsData }) {
  const { count, altMode, sw_on, increase, decrease, changeMode, activate_sw } = useMemory()

  console.log("Service worker should operate : ", sw_on);

  useEffect( async () => {
    console.log('sw switch', sw_on);
    console.log('Service Worker active ? ', navigator.serviceWorker.ready )

    if ('serviceWorker' in navigator && sw_on) {
      const wb = new Workbox('sw.js', { scope : '/' });
      wb.register();
    }   

    if (navigator.serviceWorker.controller && !sw_on) {
      navigator.serviceWorker.controller.postMessage( { type: 'UNREGISTER' });
    }

    let btn = document.getElementById('ping');

    btn.onclick = () => {
      navigator.serviceWorker.controller.postMessage(
        { type: 'ping' }
      )
    }

    navigator.serviceWorker.onmessage = (event) => {
      console.log("message from service worker : ", event);
    }

    window.addEventListener('unload', () => {
      navigator.serviceWorker.controller.postMessage( { type: "CLOSING" });
    })

  })
  
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
        <button id='ping'>Check SW clients</button>
        <br />
        <button onClick={activate_sw}>Switch service worker {sw_on ? 'off' : 'on'}</button>
        <br />
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


