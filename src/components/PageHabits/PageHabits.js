import Header from '../Header';
import Footer from '../Footer';
import RenderHabits from './RenderHabits';
import styled from 'styled-components';
import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

export default function PageHabits() {
  const [newhabit, setNewhabit] = useState(false);
  const [reloadHabits, setReloadHabits] = useState(false);
  const [habitname, setHabitname] = useState('');

  function addHabit() {
    setNewhabit(true);
  }

  return (
    <>
      <Header />
      <HabitsContainer>
        <div>
          <h4>Meus hábitos</h4>
          <Button
            width={'40px'}
            height={'35px'}
            fontSize={'27px'}
            onClick={addHabit}
          >
            +
          </Button>
        </div>

        <RegisterHabit
          newhabit={newhabit}
          setNewhabit={setNewhabit}
          reloadHabits={reloadHabits}
          setReloadHabits={setReloadHabits}
          habitname={habitname}
          setHabitname={setHabitname}
        />

        <RenderHabits
          reloadHabits={reloadHabits}
          setReloadHabits={setReloadHabits}
        />
      </HabitsContainer>
      <Footer />
    </>
  );
}

function RegisterHabit({
  newhabit,
  setNewhabit,
  reloadHabits,
  setReloadHabits,
  habitname,
  setHabitname,
}) {
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState(false);
  const { token } = useContext(UserContext);
  const [dias, setDias] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const { week, setWeek } = useContext(UserContext);

  const daysWeek = [
    { num: 0, day: 'D' },
    { num: 1, day: 'S' },
    { num: 2, day: 'T' },
    { num: 3, day: 'Q' },
    { num: 4, day: 'Q' },
    { num: 5, day: 'S' },
    { num: 6, day: 'S' },
  ];

  function saveHabit(event) {
    event.preventDefault(event);
    setSave(true);
    setLoading(false);
    setDisabled(true);

    if (week.length === 0) {
      alert('Digite o nome do hábito e selecione no mínimo um dia da semana!');
      setSave(false);
      setLoading(true);
      setDisabled(false);
    } else if (habitname.length === 0) {
      alert('Digite o nome do hábito');
      setSave(false);
      setLoading(true);
      setDisabled(false);
    } else {
      const request = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits',
        {
          name: habitname,
          days: week.sort(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      request.catch((response) => {
        console.log(response);
        alert('Algo deu errado!');
        setDisabled(false);
        setSave(false);
        setLoading(true);
      });

      request.then((response) => {
        setNewhabit(!newhabit);
        console.log(week);
        console.log(response.data);
        setReloadHabits(!reloadHabits);
        setSave(false);
        setHabitname('');
        setDisabled(false);
        setLoading(true);
        setWeek([]);
      });
    }
  }

  function cancelHabit() {
    setNewhabit(!newhabit);
  }

  return (
    <Form onSubmit={(event) => event.preventDefault()} $newhabit={newhabit}>
      <Input
        $loading={loading}
        type="text"
        placeholder="nome do hábito"
        required
        value={habitname}
        onChange={(e) => setHabitname(e.target.value)}
        disabled={disabled}
      />
      <Days>
        {daysWeek.map((day, index) => (
          <Day
            key={index}
            day={day.day}
            dias={dias}
            setDias={setDias}
            num={day.num}
            disabled={disabled}
          />
        ))}
      </Days>
      <span>
        <Cancel disabled={disabled} onClick={cancelHabit}>
          Cancelar
        </Cancel>

        {save ? (
          <Button opacity={'0.7'} width={'84px'} height={'35px'}>
            <ThreeDots color="#FFFFFF" height={15} />
          </Button>
        ) : (
          <Button
            width={'84px'}
            height={'35px'}
            fontSize={'16px'}
            onClick={saveHabit}
            type="submit"
          >
            Salvar
          </Button>
        )}
      </span>
    </Form>
  );
}

function Day({ day, num, disabled }) {
  const [background, setBackground] = useState(true);
  const { week } = useContext(UserContext);

  function choose() {
    setBackground(false);
    week.push(num);
    console.log(week);
  }

  function unChoose() {
    setBackground(true);
    week.splice(week.indexOf(num), 1);
    console.log(week);
  }

  return (
    <>
      {background ? (
        <Dayy
          onClick={choose}
          disabled={disabled}
          background={'#ffffff'}
          cor={'#DBDBDB'}
        >
          {day}
        </Dayy>
      ) : (
        <Dayy
          onClick={unChoose}
          disabled={disabled}
          background={'#CFCFCF'}
          cor={'#ffffff'}
        >
          {day}
        </Dayy>
      )}
    </>
  );
}

const HabitsContainer = styled.div`
  background-color: #e5e5e5;
  height: 200vh;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    width: 100vw;
  }

  > div h4 {
    font-size: 23px;
    color: #126ba5;
  }

  > p {
    padding: 20px;
    font-size: 18px;
    color: #666666;
    line-height: 22.5px;
  }
`;

const Form = styled.form`
  width: 90vw;
  height: 180px;
  background-color: #ffffff;
  align-items: center;
  padding: 18px;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 10px;
  display: ${(props) => (props.$newhabit ? 'initial' : 'none')};

  > span {
    width: 80vw;
    display: flex;
    align-items: center;
    justify-content: end;
    margin-top: 29px;
  }
`;

const Days = styled.div`
  width: 80vw;
  display: flex;
  justify-content: start;
`;

const Dayy = styled.button`
  width: 30px;
  height: 30px;
  background-color: ${(props) => props.background};
  border: solid 1px #d4d4d4;
  border-radius: 5px;
  color: ${(props) => props.cor};
  margin-right: 4px;
  margin-top: 2px;
  font-size: 20px;
  font-weight: 400;
  font-family: Lexend Deca;
`;

const Cancel = styled.button`
  border: none;
  background-color: #ffffff;
  font-size: 16px;
  color: #52b6ff;
  margin-right: 23px;
  opacity: ${(props) => (props.$save ? '0.6' : '1.0')};
`;
