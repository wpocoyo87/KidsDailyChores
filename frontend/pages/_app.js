import '../src/app/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <div style={{ fontFamily: 'Comic Sans MS' }}>
      <Component {...pageProps} />
    </div>
  )
}
