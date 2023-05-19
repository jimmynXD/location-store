import clsx from 'clsx'
import Head from 'next/head'

export interface PageLayoutProps {
  title?: string
  children: React.ReactNode
  className?: string
}
export function PageLayout(props: PageLayoutProps) {
  return (
    <>
      <Head>
        <title>{props.title ?? 'location'}</title>
      </Head>
      <div className={clsx(props.className, 'flex flex-col min-h-screen')}>
        {props.children}
        {/* <Header />
        <main className="pt-24 px-2">{props.children}</main> */}
      </div>
    </>
  )
}
