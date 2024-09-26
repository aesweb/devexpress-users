import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form, { Item, GroupItem, ButtonItem } from 'devextreme-react/form';
import DataGrid, {
  Column,
  HeaderFilter,
  Paging,
  Pager,
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import LoadIndicator from 'devextreme-react/load-indicator';
import { useUser } from '../../contexts/UserContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
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

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUpdatedUser, users, cartProducts, setCartProducts } = useUser();

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        let userData;
        const existingUser = users.find((u) => u.id === Number(id));
        if (existingUser) {
          userData = existingUser;
        } else {
          const userResponse = await fetch(`https://dummyjson.com/users/${id}`);
          userData = await userResponse.json();
        }
        setUser(userData);

        if (!cartProducts[Number(id)]) {
          const cartResponse = await fetch(
            `https://dummyjson.com/carts/user/${id}`
          );
          const cartData = await cartResponse.json();
          const products = cartData.carts.flatMap((cart: any) =>
            cart.products.map((product: CartProduct) => ({
              ...product,
              cartId: cart.id,
            }))
          );
          setCartProducts((prev) => ({ ...prev, [Number(id)]: products }));
        }
      } catch (error) {
        console.error('Error fetching user or cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCart();
  }, [id, users, cartProducts, setCartProducts]);

  const handleFieldDataChanged = (e: any) => {
    if (user) {
      const { dataField, value } = e;
      setUser((prevUser) => {
        if (!prevUser) return null;

        // Nested alanlar için özel işlem
        if (dataField.includes('.')) {
          const [parent, child] = dataField.split('.');
          return {
            ...prevUser,
            [parent]: {
              ...(typeof prevUser[parent as keyof User] === 'object' &&
              prevUser[parent as keyof User] !== null
                ? (prevUser[parent as keyof User] as Record<string, unknown>)
                : {}),
              [child]: value,
            },
          };
        }

        // Normal alanlar için
        return {
          ...prevUser,
          [dataField]: value,
        };
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const updatedUser = await response.json();
      console.log('User updated:', updatedUser);
      setUpdatedUser(updatedUser);
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const discountCellRender = (cellData: { value: number }) => (
    <div className="discount-cell">{cellData.value.toFixed(2)}%</div>
  );

  const handleDeleteProduct = async (productId: number) => {
    try {
      // API çağrısı simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ürünü yerel state'den kaldır
      setCartProducts((prev) => ({
        ...prev,
        [Number(id)]: prev[Number(id)].filter(
          (product) => product.id !== productId
        ),
      }));

      console.log(`Product with id ${productId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const renderActionButtons = (cellData: { data: CartProduct }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          icon="trash"
          onClick={() => handleDeleteProduct(cellData.data.id)}
          stylingMode="text"
        />
      </div>
    );
  };

  if (loading) {
    return <LoadIndicator />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Edit User</h2>
      <div className={'content-block dx-card responsive-paddings'}>
        <Form
          formData={user}
          onFieldDataChanged={handleFieldDataChanged}
          labelLocation={'top'}
          colCount={1}
        >
          <GroupItem caption="Personal Information" colCount={7}>
            <Item dataField="firstName" />
            <Item dataField="lastName" />
            <Item dataField="maidenName" />
            <Item dataField="age" />
            <Item dataField="gender" />
            <Item dataField="birthDate" />
            <Item dataField="bloodGroup" />
            <Item dataField="height" />
            <Item dataField="weight" />
            <Item dataField="eyeColor" />

            <Item dataField="hair.color" />
            <Item dataField="hair.type" />

            <Item dataField="username" />
            <Item dataField="password" editorOptions={{ mode: 'password' }} />
          </GroupItem>

          <GroupItem colCount={4}>
            <GroupItem caption="Address">
              <Item dataField="address.address" />
              <Item dataField="address.city" />
              <Item dataField="address.state" />
              <Item dataField="address.stateCode" />
              <Item dataField="address.postalCode" />
              <Item dataField="address.country" />
            </GroupItem>
            <GroupItem caption="Contact Information">
              <Item dataField="email" />
              <Item dataField="phone" />
            </GroupItem>

            <GroupItem caption="Crypto Information">
              <Item dataField="crypto.coin" />
              <Item dataField="crypto.wallet" />
              <Item dataField="crypto.network" />
            </GroupItem>

            <GroupItem caption="Company">
              <Item dataField="company.name" />
              <Item dataField="company.department" />
              <Item dataField="company.title" />
            </GroupItem>
          </GroupItem>

          <ButtonItem
            horizontalAlignment="left"
            buttonOptions={{
              text: 'Save',
              type: 'success',
              useSubmitBehavior: true,
              onClick: handleSubmit,
            }}
          />
          <ButtonItem
            horizontalAlignment="left"
            buttonOptions={{
              text: 'Cancel',
              type: 'normal',
              onClick: handleCancel,
            }}
          />
        </Form>
      </div>

      <h2 className={'content-block'}>User's Cart Products</h2>
      <DataGrid
        className="content-block dx-card responsive-paddings"
        dataSource={cartProducts[Number(id)] || []}
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
        <Column
          cellRender={renderActionButtons}
          width={100}
          allowFiltering={false}
          allowHeaderFiltering={false}
        />
      </DataGrid>
    </React.Fragment>
  );
}
