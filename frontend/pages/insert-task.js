import dynamic from 'next/dynamic';
const InsertTask = dynamic(() => import('../components/InsertTask'), { ssr: false });

export default function InsertTaskPage() {
  return <InsertTask />;
}

export async function getServerSideProps() {
  return { props: {} };
} 