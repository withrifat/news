
import './index.css'
import Newscatagory from './Components/News/Newscatagory'
import { Suspense } from 'react'


// api call
const newsHeadersPromise = fetch('https://news-api-fs.vercel.app/api/categories').then(res=>res.json())


function App() {


  return (
    <>
      <Suspense fallback={<span className="loading loading-spinner loading-xl"></span>}>
      <Newscatagory newsHeadersPromise={newsHeadersPromise} ></Newscatagory>
      </Suspense>
    </>
  )
}

export default App
