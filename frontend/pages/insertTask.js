import dynamic from 'next/dynamic';
const InsertTask = dynamic(() => import('../components/InsertTask'), { ssr: false });
export default InsertTask; 