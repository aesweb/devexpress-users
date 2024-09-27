import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form, { Item, GroupItem } from 'devextreme-react/form';
import DataGrid, {
  Column,
  HeaderFilter,
  Pager,
  Editing,
  SearchPanel,
  ColumnChooser,
  FilterRow,
} from 'devextreme-react/data-grid';
import LoadIndicator from 'devextreme-react/load-indicator';
import { useUser } from '../../contexts/UserContext';
import Button from 'devextreme-react/button';
import './edit-user.scss';
import { ExtendedUser, CartProduct } from '../../types';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUpdatedUser, users, setUsers, cartProducts, setCartProducts } =
    useUser();
  const [updatedProducts, setUpdatedProducts] = useState<CartProduct[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);

  const userId = useMemo(() => Number(id), [id]);

  const fetchUserAndCart = useCallback(async () => {
    try {
      let userData =
        users.find((u) => u.id === userId) ||
        (await (await fetch(`https://dummyjson.com/users/${id}`)).json());
      setUser(userData);

      if (!cartProducts[userId]) {
        const cartData = await (
          await fetch(`https://dummyjson.com/carts/user/${id}`)
        ).json();
        const products = cartData.carts.flatMap((cart: any) =>
          cart.products.map((product: CartProduct) => ({
            ...product,
            cartId: cart.id,
          }))
        );
        setCartProducts((prev) => ({ ...prev, [userId]: products }));
      }
    } catch (error) {
      console.error('Error fetching user or cart:', error);
    } finally {
      setLoading(false);
    }
  }, [id, userId, users, cartProducts, setCartProducts]);

  useEffect(() => {
    fetchUserAndCart();
  }, [fetchUserAndCart]);

  const handleFieldDataChanged = useCallback((e: any) => {
    const { dataField, value } = e;
    setUser((prevUser) => {
      if (!prevUser) return null;

      if (dataField.includes('.')) {
        const [parent, child] = dataField.split('.');
        return {
          ...prevUser,
          [parent]: {
            ...(prevUser[parent as keyof ExtendedUser] as Record<string, unknown>),
            [child]: value,
          },
        };
      }

      return { ...prevUser, [dataField]: value };
    });
  }, []);

  const handleProductUpdate = useCallback(
    (key: number, data: Partial<CartProduct>) => {
      setUpdatedProducts((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === key);
        if (existingIndex >= 0) {
          return prev.map((p) => (p.id === key ? { ...p, ...data } : p));
        } else {
          return [...prev, { id: key, ...data } as CartProduct];
        }
      });
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!user) return;

    try {
      const updatedUser = await (
        await fetch(`https://dummyjson.com/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        })
      ).json();
      setUpdatedUser(updatedUser);

      const updatedCartProducts = cartProducts[userId]
        .map((product) => {
          const updatedProduct = updatedProducts.find(
            (p) => p.id === product.id
          );
          return updatedProduct ? { ...product, ...updatedProduct } : product;
        })
        .filter((product) => !deletedProductIds.includes(product.id));

      setCartProducts((prev) => ({ ...prev, [userId]: updatedCartProducts }));

      navigate('/users');
    } catch (error) {
      console.error('Error updating user or products:', error);
    }
  }, [
    user,
    id,
    userId,
    cartProducts,
    updatedProducts,
    deletedProductIds,
    setUpdatedUser,
    setCartProducts,
    navigate,
  ]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
      setCartProducts((prev) => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });
      navigate('/users');
    }
  }, [userId, setUsers, users, setCartProducts, navigate]);

  const discountCellRender = (cellData: { value: number }) => (
    <div className="discount-cell">{cellData.value.toFixed(2)}%</div>
  );

  if (loading) return <LoadIndicator />;
  if (!user) return <div>User not found</div>;

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
        </Form>
      </div>

      <div className="button-container">
        <Button text="Save" type="success" onClick={handleSubmit} />
        <Button text="Delete" type="danger" onClick={handleDelete} />
        <Button text="Cancel" onClick={() => navigate('/users')} />
      </div>

      <h2 className={'content-block'}>User's Cart Products</h2>
      <DataGrid
        className="content-block dx-card responsive-paddings user-cart-grid"
        dataSource={
          cartProducts[userId]?.filter(
            (p) => !deletedProductIds.includes(p.id)
          ) || []
        }
        keyExpr="id"
        showBorders={true}
        focusedRowEnabled={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        columnHidingEnabled={true}
        onRowUpdating={(e) => handleProductUpdate(e.key, e.newData)}
        onRowRemoving={(e) => {
          setDeletedProductIds((prev) => [...prev, e.key]);
          e.cancel = true;
        }}
      >
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          useIcons={true}
        />
        <HeaderFilter visible={true} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <SearchPanel visible={true} />
        <ColumnChooser enabled={true} />
        <FilterRow visible={true} />

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
          caption={'Discount'}
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
