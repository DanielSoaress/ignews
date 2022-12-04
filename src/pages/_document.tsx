import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
                    <link rel="shortcut icon" href="/favicon.png" type="image/png" />

                    <meta name='author' content='Daniel Soares, Lost Code' />
                    <meta name='description' content='Novidades sobre o mundo do desenvolvimento. Compartilho um pouco do meu trabalho e alguns aprendizados' />
                    <meta name='keywords' content='html, css, js, vue.js, react, frontend, web, front-end, desenvolvedor, programação, tecnologia, lost code' />
                    <meta name='robots' content='index, follow' />
                    <meta charSet='utf-8' />
                    <meta httpEquiv='refresh' content='72000' />
                    <meta name="copyright" content="Daniel Soares 2022"></meta>
                    <meta httpEquiv="content-language" content="pt-br"></meta>
                    <meta name="theme-color" content="#B94899" />
                    <meta property="og:title" content="Blog // Lost Code"></meta>
                    <meta property="og:description" content="Blog // Lost Code"></meta>

                    <meta property="og:image" content="/preview.png" />

                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7095813431778606"
                        crossOrigin="anonymous"></script>
                    <script>(window.adsbygoogle = window.adsbygoogle || []).push({})</script>
                </body>
            </Html>
        )
    }
} 