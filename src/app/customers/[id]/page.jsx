import SingleCustomer from '@/app/_components/SingleCustomer';
import { getOneCustomer } from '@/app/actions/customer.action';

const page = async ({params}) => {
  const data = await getOneCustomer(params.id);
  return (
    <div><SingleCustomer data={data}/></div>
  )
}

export default page