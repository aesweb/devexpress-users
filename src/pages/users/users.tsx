import React, { useEffect, useState, useCallback } from 'react';
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
  SearchPanel,
  ColumnChooser,
} from 'devextreme-react/data-grid';
import { FocusedRowChangedEvent } from 'devextreme/ui/data_grid';
import { useNavigate } from 'react-router-dom';
import Button from 'devextreme-react/button';
import './users.css';
import { useUser } from '../../contexts/UserContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  cartId?: number;
}

export default function Users() {
  const { users, setUsers, updatedUser, setUpdatedUser } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    if (users.length === 0) {
      const response = await fetch('https://dummyjson.com/users');
      const data = await response.json();
      setUsers(data.users);
    }
  }, [users, setUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (updatedUser) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setUpdatedUser(null);  // Güncellemeyi sıfırla
    }
  }, [updatedUser, setUsers, setUpdatedUser]);

  const fetchUserCart = useCallback(async (userId: number) => {
    const response = await fetch(`https://dummyjson.com/carts/user/${userId}`);
    const data = await response.json();
    const products = data.carts.flatMap((cart: any) =>
      cart.products.map((product: CartProduct) => ({
        ...product,
        cartId: cart.id,
      }))
    );
    setCartProducts(products);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserCart(selectedUserId);
    } else {
      setCartProducts([]);
    }
  }, [selectedUserId, fetchUserCart]);

  const onFocusedRowChanged = (e: FocusedRowChangedEvent) => {
    setSelectedUserId(e.row?.data.id);
  };

  const discountCellRender = (cellData: { value: number }) => (
    <div className="discount-cell">{cellData.value.toFixed(2)}%</div>
  );

  const editUser = (userId: number) => {
    navigate(`/edit-user/${userId}`);
  };

  const renderEditButton = (cellData: { data: User }) => {
    return <Button icon="edit" onClick={() => editUser(cellData.data.id)} />;
  };

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Users</h2>
      <DataGrid
        allowColumnReordering={true}
        dataSource={users}
        keyExpr="id"
        showBorders={true}
        focusedRowEnabled={true}
        columnHidingEnabled={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        onFocusedRowChanged={onFocusedRowChanged}
      >
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <SearchPanel visible={true} />

        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />

        <Column
          caption={'User'}
          calculateCellValue={(rowData: User) =>
            `${rowData.firstName} ${rowData.lastName}`
          }
          allowFiltering={true}
          allowHeaderFiltering={true}
        />
        <ColumnChooser enabled={true} />
        <Column
          dataField={'phone'}
          caption={'Phone'}
          alignment="center"
          allowFiltering={true}
          allowHeaderFiltering={true}
        />
        <Column
          dataField={'email'}
          caption={'Email'}
          alignment="center"
          allowFiltering={true}
          allowHeaderFiltering={true}
        />
        <Column
          dataField={'id'}
          caption={'Action'}
          alignment="center"
          allowFiltering={false}
          allowHeaderFiltering={false}
          cellRender={renderEditButton}
          width={100}
        />
      </DataGrid>

      <h2 className={'content-block'}>User's Cart Products</h2>
      <DataGrid
        dataSource={cartProducts}
        keyExpr="id"
        showBorders={true}
        focusedRowEnabled={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        columnHidingEnabled={true}
      >
        <HeaderFilter visible={true} />
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />

        <Column
          dataField={'title'}
          caption={'Product Name'}
          allowHeaderFiltering={true}
        />
        <Column
          dataField={'price'}
          caption={'Price'}
          alignment="center"
          cellRender={(cellData: { value: number }) =>
            `$ ${cellData.value.toFixed(2)}`
          }
          allowHeaderFiltering={true}
        />
        <Column
          dataField={'quantity'}
          caption={'Quantity'}
          alignment="center"
          allowHeaderFiltering={true}
        />
        <Column
          dataField={'total'}
          caption={'Total'}
          alignment="center"
          cellRender={(cellData: { value: number }) =>
            `$ ${cellData.value.toFixed(2)}`
          }
          allowHeaderFiltering={true}
        />
        <Column
          dataField={'discountPercentage'}
          caption={'Discount %'}
          alignment="center"
          cellRender={discountCellRender}
          allowHeaderFiltering={true}
        />
        <Column
          caption={'Discounted Total'}
          alignment="center"
          calculateCellValue={(rowData: CartProduct) => {
            const discountedTotal =
              rowData.total -
              (rowData.total * rowData.discountPercentage) / 100;
            return `$ ${discountedTotal.toFixed(2)}`;
          }}
          allowHeaderFiltering={true}
        />
      </DataGrid>
    </React.Fragment>
  );
}
