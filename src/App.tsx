import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JSZipArea from './components/JSZipArea'
import LocalFileDownloadArea from './components/LocalFileDownloadArea'
import LocalFileZipArea from './components/LocalFileZipArea'

function App() {

  return (
    <>
      <div className="logo-area">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h2>Vite + React</h2>
      <div className="card-area">
        <JSZipArea />
        <LocalFileDownloadArea />
        <LocalFileZipArea />
      </div>
    </>
  )
}

export default App
