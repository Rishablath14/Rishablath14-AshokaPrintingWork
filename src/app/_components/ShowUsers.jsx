import { getAllCustomer } from '../actions/customer.action';
import DataTableDemo from './CustomersTable';

const ShowUsers = async () => {
  const customers = await getAllCustomer();
  return (
    <div>
      <DataTableDemo customers={customers}/>
    </div>
  )
}

export default ShowUsers