import React, { useEffect, useState } from 'react';
import DataGrid, { Column, Pager, Paging } from 'devextreme-react/data-grid';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // New state for products

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.users));

    // Fetch products
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products)); // Set products data
  }, []);

  return (
    <React.Fragment>
      <h2 className={'content-block'}>User List</h2>
      <p className={'content-block'}>
        Drag a column header to group by that column
      </p>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={users}
        keyExpr="id"
        showBorders={false}
        focusedRowEnabled={true}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />

        <Column dataField={'firstName'} caption={'User'} />
        <Column dataField={'phone'} caption={'Phone'} />
        <Column dataField={'email'} caption={'Email'} />
        <Column caption={'Action'} cellRender={() => <span>X</span>} />
      </DataGrid>

      <h2 className={'content-block'}>Product List</h2>
      <p className={'content-block'}>
        Drag a column header to group by that column
      </p>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={products}
        keyExpr="id"
        showBorders={false}
        focusedRowEnabled={true}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <Column dataField={'title'} caption={'Product Name'} />
        <Column
          dataField={'price'}
          caption={'Price'}
          cellRender={(cellData) => `$ ${cellData.value}`}
        />
        <Column dataField={'category'} caption={'Category'} />
        <Column
          dataField={'discountPercentage'}
          caption={'Discount Percentage'}
        />
        <Column
          caption={'Total Price'}
          calculateCellValue={(rowData) => rowData.price} // Total price
        />
        <Column
          caption={'Discounted Total'}
          calculateCellValue={(rowData) => {
            const price = rowData.price;
            const discount = rowData.discountPercentage || 0;
            return price - (price * discount) / 100;
          }}
        />
      </DataGrid>
    </React.Fragment>
  );
}
