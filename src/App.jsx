
import './index.css'
import Newscatagory from './Components/News/Newscatagory'
import { Suspense } from 'react'
import Navbar from './Components/Nav/Navbar'


// api call
const newsHeadersPromise = fetch('https://news-api-fs.vercel.app/api/categories').then(res=>res.json())


function App() {


  return (
    <>
    <div className="container mx-auto ">
      <Navbar></Navbar>
      <Suspense fallback={<span className="loading loading-spinner loading-xl"></span>}>
        <Newscatagory newsHeadersPromise={newsHeadersPromise} ></Newscatagory>
      </Suspense>

    </div>
    </>
  )
}

export default App
