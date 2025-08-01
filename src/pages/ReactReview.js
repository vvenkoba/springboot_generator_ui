import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

const products = [
  {
    name: 'Java',
    desc: 'Version',
    price: '17',
  },
  {
    name: 'React JS',
    desc: 'Version',
    price: '3.0',
  },
  {
    name: 'Env',
    desc: 'Environment to deploy',
    price: 'Dev,IT',
  },
  {
    name: 'Security Scan',
    desc: 'Fortify,Blackduck and Sonar Scan',
    price: 'Yes',
  },
  // {
  //   name: 'Product 2',
  //   desc: 'Another thing',
  //   price: '$3.45',
  // },
  // {
  //   name: 'Product 3',
  //   desc: 'Something else',
  //   price: '$6.51',
  // },
  // {
  //   name: 'Product 4',
  //   desc: 'Best thing of all',
  //   price: '$14.11',
  // },
  // { name: 'Shipping', desc: '', price: 'Free' },
];

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
  { name: 'Project Type', detail: 'React JS' },
  // { name: 'Card holder', detail: 'Mr John Smith' },
  // { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
  // { name: 'Expiry date', detail: '04/2024' },
];

export default function ReactReview() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Project summary
      </Typography>
      <List disablePadding>
        {products.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={product.name} secondary={product.desc} />
            <Typography variant="body2">{product.price}</Typography>
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total Dependencies" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            5
          </Typography>
        </ListItem>
      </List>

    </React.Fragment>
  );
}
