import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { setQuery } from '@/salesmaster/features/OrderSearchSlice';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const ClickableStyled = styled.div`
  font-family: sans-serif;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  background-color: darkblue;
  padding: 10px;
  border-radius: 10px;

  &:hover {
    box-shadow: 0px 0px 10px 1px #555;
  }
`;

export interface IProps {
  item: string;
  forCustomer?: boolean;
  forDate?: boolean;
}
export const Clickable = ({ item, forCustomer, forDate }: IProps) => {
  const dispatch = useDispatch();
  return (
    <ClickableStyled
      onClick={() => {
        dispatch(setQuery(item));
        setTimeout(() => {
          (
            document.querySelector(
              '#searchInput',
            ) as unknown as HTMLInputElement
          ).select();
        }, 5);
      }}
    >
      {(forCustomer ?? false) && <PersonIcon />}
      {(forDate ?? false) && <CalendarMonthIcon />}
      <div>{item}</div>
    </ClickableStyled>
  );
};
export default Clickable;
