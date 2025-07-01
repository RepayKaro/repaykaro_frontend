import CustomerTableBase from "./CustomerTableBase";

const CustomerTable = () => {
  return (
    <CustomerTableBase 
      endpoint="/api/admin/customers/list" 
      title="Customers" 
      type="current-customers" // Specify the type for customer list
    />
  );
};

export default CustomerTable;