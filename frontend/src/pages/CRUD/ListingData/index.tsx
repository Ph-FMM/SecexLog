import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { useUser, UserState } from '../../../hooks/modules/user';

import { Container, DataSection } from './styles';

import Header from '../../../components/Header';
import Menu from '../../../components/Menu';
import Input from '../../../components/Input';
import Table from '../../../components/Table';
import LoadingPartial from '../../../components/Loading/LoadingPartial';

import UserOperationsPopup from '../../../components/Popup/CRUD/UserOperationsPopup';

import iconSearch from '../../../assets/icon-search.png';
import iconEdit from '../../../assets/icon-edit.png';

interface ModuleHeaderProps {
  pluralName:
    | 'usuários'
    | 'cidades'
    | 'feriados'
    | 'provedores'
    | 'modais'
    | 'trajetos';
  singularName:
    | 'usuário'
    | 'cidade'
    | 'feriado'
    | 'provedor'
    | 'modal'
    | 'trajeto';
}

interface UserOperationsPopupProps {
  operation: 'criar' | 'editar';
  user?: UserState;
}

const ListingData: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [userOperationsPopupActive, setUserOperationsPopupActive] = useState(
    false,
  );
  const [userOperationsPopup, setUserOperationsPopup] = useState<
    UserOperationsPopupProps
  >({} as UserOperationsPopupProps);

  const [loadingPartial, setLoadingPartial] = useState(false);

  const { users, getUsers, setSearchUsers } = useUser();

  const handleGetUsers = useCallback(async () => {
    setLoadingPartial(true);

    await getUsers().then(() => {
      setLoadingPartial(false);
    });
  }, [getUsers]);

  const handleSearchUsers = useCallback(
    (data: { searchUser: string }) => {
      setLoadingPartial(true);
      if (!data.searchUser) {
        setSearchUsers('');
      } else {
        setSearchUsers(data.searchUser);
      }
      setLoadingPartial(false);
    },
    [setSearchUsers],
  );

  useEffect(() => {
    handleGetUsers();
  }, [handleGetUsers]);

  const ModuleHeader: React.FC<ModuleHeaderProps> = ({
    singularName,
    pluralName,
  }) => (
    <>
      <h1>{pluralName.charAt(0).toUpperCase() + pluralName.slice(1)}</h1>
      <hr />

      <strong>
        Pesquisar
        {` ${pluralName}`}
      </strong>

      <div>
        <Form ref={formRef} onSubmit={handleSearchUsers}>
          <Input
            name="searchUser"
            type="text"
            placeholder={
              singularName.charAt(0).toUpperCase() +
              singularName.slice(1).concat('...')
            }
          />
          <button type="submit">
            <img src={iconSearch} alt="Search" />
          </button>
        </Form>
      </div>

      <section>
        <strong>
          Adicionar
          {` ${singularName}`}
        </strong>
        <button
          type="button"
          onClick={() => {
            setUserOperationsPopupActive(true);
            setUserOperationsPopup({
              operation: 'criar',
            });
            setSearchUsers('');
          }}
        >
          +
        </button>
      </section>
    </>
  );

  const UsersTable: React.FC = () => (
    <Table>
      <thead>
        <tr>
          <th>Usuário</th>
          <th>Login</th>
          <th>Email</th>
          <th>Cargo</th>
          <th>Senha</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.nome}</td>
            <td>{user.login}</td>
            <td>{user.email}</td>
            <td>{user.cargo}</td>
            <td>{'*'.repeat(user.senha.length)}</td>
            <td>
              <button
                type="button"
                onClick={() => {
                  setUserOperationsPopupActive(true);
                  setUserOperationsPopup({
                    operation: 'editar',
                    user,
                  });
                }}
              >
                <img src={iconEdit} alt="Edit" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      {loadingPartial && <LoadingPartial />}

      {userOperationsPopupActive && (
        <UserOperationsPopup
          operation={userOperationsPopup.operation}
          user={userOperationsPopup.user}
          setUserOperationsPopupActive={setUserOperationsPopupActive}
        />
      )}

      <Header isAuthenticated />

      <Menu />

      <Container>
        <DataSection>
          <ModuleHeader pluralName="usuários" singularName="usuário" />
          <UsersTable />
        </DataSection>
      </Container>
    </>
  );
};

export default ListingData;
