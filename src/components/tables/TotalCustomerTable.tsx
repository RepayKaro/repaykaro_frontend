import CustomerTableBase from './CustomerTableBase';

const TotalCustomerTable = () => {
  return (
    <CustomerTableBase 
      endpoint="/api/admin/customers/list" 
      title="Total List" 
      type="total-customers" // Specify the type for total list
    />
  );
};

export default TotalCustomerTable;