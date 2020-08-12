import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { useCity } from '../../hooks/modules/city';
import { useToast } from '../../hooks/toast';

import {
  Container,
  Content,
  InputsContainer,
  CalendarInput,
  OptionsContainer,
  ButtonsContainer,
} from './styles';

import {
  Header,
  Select,
  Button,
  DateInput,
  LoadingPartial,
} from '../../components';

import logoSecex from '../../assets/logo-secex.png';
import progressBar from '../../assets/progressBar.png';
import iconGo from '../../assets/icon-go.png';
import iconBack from '../../assets/icon-back.png';
import iconCalendar from '../../assets/icon-calendar.png';

const AutomaticSearch: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [citiesSelect, setCitiesSelect] = useState<String[]>([]);
  const [initialDate, setInitialDate] = useState<Date>(new Date());
  const [finalDate, setFinalDate] = useState<Date>(new Date());
  const [pathsControl, setPathsControl] = useState([1]);

  const [loadingPartial, setLoadingPartial] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { cities, getCities } = useCity();
  const { addToast } = useToast();

  const handleGetCities = useCallback(async () => {
    setLoadingPartial(true);

    await getCities().then(() => {
      setLoadingPartial(false);
    });
  }, [getCities]);

  useEffect(() => {
    setCitiesSelect(cities.map(city => city.nome));
  }, [cities]);

  useEffect(() => {
    if (!isLoaded) {
      handleGetCities();
      setIsLoaded(true);
    }
  }, [handleGetCities, isLoaded]);

  const handleDecreasePathNumber = () => {
    if (pathsControl.length > 1) {
      setPathsControl(state => state.slice(0, pathsControl.length - 1));
    }
  };

  const handleIncreasePathNumber = () => {
    setPathsControl([...pathsControl, pathsControl.length + 1]);
  };

  const handleSearch = useCallback(
    async (data: Object) => {
      try {
        Object.entries(data).forEach(entry => {
          const value = entry[1];
          if (
            value === 'Selecione a cidade de ida' ||
            value === 'Selecione a cidade de volta'
          ) {
            throw new Error();
          }
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Selecione todos os campos',
        });
      }
    },
    [addToast],
  );

  return (
    <>
      {loadingPartial && <LoadingPartial zIndex={1} />}

      <Container>
        <Header isAuthenticated={false} />

        <Content>
          <img src={logoSecex} alt="SecexLog" />

          <img src={progressBar} alt="ProgressBar" />

          <Form ref={formRef} onSubmit={handleSearch}>
            <InputsContainer>
              <aside>
                <Select
                  defaultValue="Selecione a cidade de ida"
                  icon={iconGo}
                  name="ida"
                >
                  <option value="Selecione a cidade de ida" disabled>
                    Selecione a cidade de ida
                  </option>
                  {citiesSelect.map((city, index) => (
                    <option key={`go-${String(index)}`} value={String(city)}>
                      {city}
                    </option>
                  ))}
                </Select>

                {pathsControl.map(path => (
                  <Select
                    defaultValue="Selecione a cidade para auditoria"
                    icon={iconBack}
                    key={`path-${String(path)}`}
                    name={`auditada-${path}`}
                  >
                    <option value="Selecione a cidade para auditoria" disabled>
                      Selecione a cidade para auditoria
                    </option>
                    {citiesSelect.map((city, index) => (
                      <option
                        key={`back-${String(index)}`}
                        value={String(city)}
                      >
                        {city}
                      </option>
                    ))}
                  </Select>
                ))}
              </aside>

              <section>
                <CalendarInput>
                  <DateInput date={initialDate} setDate={setInitialDate} />
                  <img src={iconCalendar} alt="Icon" />
                </CalendarInput>

                <CalendarInput>
                  <DateInput date={finalDate} setDate={setFinalDate} />
                  <img src={iconCalendar} alt="Icon" />
                </CalendarInput>
              </section>
            </InputsContainer>

            <OptionsContainer>
              <ul>
                {pathsControl.length > 1 && (
                  <li>
                    <button type="button" onClick={handleDecreasePathNumber}>
                      <b>-</b>
                      Retirar cidade
                    </button>
                  </li>
                )}
                <li>
                  <button type="button" onClick={handleIncreasePathNumber}>
                    <b>+</b>
                    Mais cidades para auditar
                  </button>
                </li>
              </ul>
            </OptionsContainer>

            <ButtonsContainer>
              <Button type="submit">Consultar</Button>

              <Link to="/">
                Consulta Manual
                <FiArrowRight size={24} />
              </Link>
            </ButtonsContainer>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default AutomaticSearch;
