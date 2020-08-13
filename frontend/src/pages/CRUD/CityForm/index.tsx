import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../../utils/getValidationErrors';

import { useCity, CityOperationsData } from '../../../hooks/modules/city';

import { Container, Content, InputsContainer } from './styles';

import {
  Header,
  Menu,
  Input,
  Textarea,
  Button,
  SwitchInput,
  LoadingPartial,
  LoadingPage,
} from '../../../components';

import DateRangeInput, { RangeState } from '../../../components/DateRangeInput';
import MultiSelect, { Option } from '../../../components/MultiSelect';

import iconCrud from '../../../assets/icon-crud-2.png';
import iconBell from '../../../assets/icon-bell.png';

const CityForm: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const [isBaseCity, setIsBaseCity] = useState(false);
  const [isAuditatedCity, setIsAuditatedCity] = useState(false);
  const [isInterdicted, setIsInterdicted] = useState(false);
  const [rangeFlood, setRangeFlood] = useState<RangeState>({} as RangeState);
  const [selectedRelatedCities, setSelectedRelatedCities] = useState<Option[]>(
    [],
  );

  const [citiesSelect, setCitiesSelect] = useState<Option[]>([]);

  const [loadingPartial, setLoadingPartial] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { cities, getCities, insertCity } = useCity();

  const handleGetCities = useCallback(async () => {
    setLoadingPartial(true);

    await getCities().then(() => {
      setLoadingPartial(false);
    });
  }, [getCities]);

  useEffect(() => {
    setCitiesSelect(
      cities.map(city => {
        return {
          value: city.nome,
          label: city.nome,
        };
      }),
    );
  }, [cities]);

  useEffect(() => {
    if (!isLoaded) {
      handleGetCities();
      setIsLoaded(true);
    }
  }, [handleGetCities, isLoaded]);

  const handleCreate = useCallback(
    async (data: CityOperationsData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          nome: Yup.string().required('Nome da cidade obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const cityData: CityOperationsData = {
          cAuditada: isAuditatedCity,
          cBase: isBaseCity,
          nome: data.nome,
          latitute: data.latitute,
          longitude: data.longitude,
          obsCidade: data.obsCidade,
          initDataCheia: rangeFlood.from
            ? rangeFlood.from.toLocaleDateString('pt-BR')
            : '',
          endDataCheia: rangeFlood.to
            ? rangeFlood.to.toLocaleDateString('pt-BR')
            : '',
          relations: selectedRelatedCities
            .map(relatedCity => relatedCity.value)
            .join(', '),
          obsInterdicao: isInterdicted ? data.obsInterdicao : '',
        };

        setLoadingPage(true);

        await insertCity(cityData).then(() => {
          setLoadingPage(false);
        });

        history.push('/listing-data');
      } catch (err) {
        setLoadingPage(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [
      history,
      insertCity,
      isAuditatedCity,
      isBaseCity,
      isInterdicted,
      rangeFlood.from,
      rangeFlood.to,
      selectedRelatedCities,
    ],
  );

  return (
    <>
      {loadingPartial && <LoadingPartial zIndex={1} />}
      {loadingPage && <LoadingPage />}

      <Header isAuthenticated />

      <Menu isAuthenticated />

      <Container>
        <Content>
          <img src={iconCrud} alt="Crud" />
          <h1>Cadastro de Cidade</h1>
          <hr />

          <InputsContainer>
            <Form ref={formRef} onSubmit={handleCreate}>
              <strong>Nome da cidade</strong>
              <div>
                <Input name="nome" type="text" />
                <section>
                  <section>
                    <SwitchInput
                      isChecked={isBaseCity}
                      setIsChecked={setIsBaseCity}
                    />
                    <h2>Cidade Base</h2>
                  </section>
                  <section>
                    <SwitchInput
                      isChecked={isAuditatedCity}
                      setIsChecked={setIsAuditatedCity}
                    />
                    <h2>Cidade Auditada</h2>
                  </section>
                </section>
              </div>

              <nav>
                <strong>Adicionar cidades relacionadas</strong>
                <MultiSelect
                  placeholder="Selecione"
                  options={citiesSelect}
                  setSelectedOptions={setSelectedRelatedCities}
                />
              </nav>

              <div>
                <nav>
                  <strong>Latitude</strong>
                  <Input name="latitute" type="number" step="any" />
                </nav>
                <nav>
                  <strong>Longitude</strong>
                  <Input name="longitude" type="number" step="any" />
                </nav>
              </div>

              <section>
                <strong>Adicionar períodos de cheias de rios</strong>
                <DateRangeInput
                  rangeDays={rangeFlood}
                  setRangeDays={setRangeFlood}
                />
              </section>

              <div>
                <strong>Interdição de trecho</strong>
                <SwitchInput
                  isChecked={isInterdicted}
                  setIsChecked={setIsInterdicted}
                />
                <img src={iconBell} alt="Bell" />
              </div>

              <strong>Observação da Interdição</strong>
              {isInterdicted ? (
                <Textarea name="obsInterdicao" />
              ) : (
                <Textarea name="obsInterdicao" disabled />
              )}

              <strong>Observação da cidade</strong>
              <Textarea name="obsCidade" />

              <aside>
                <Button type="submit">Criar</Button>
              </aside>
            </Form>
          </InputsContainer>
        </Content>
      </Container>
    </>
  );
};

export default CityForm;
