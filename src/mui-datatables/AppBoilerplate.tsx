import MUIDataTable from './components/MUIDatatable';

export default function AppBoilerplate() {
  const columnNames = [
    { name: 'ID', options: { filterOptions: { fullWidth: true } } },
    'First Name',
    'Last Name',
    'Email',
    'Password',
    'Created At',
    'Updated At',
  ];
  return (
    <MUIDataTable
      title={'Users Table'}
      customColumnNames={columnNames}
      data={[]}
    />
  );
}
