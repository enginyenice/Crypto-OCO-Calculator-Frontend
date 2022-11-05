import React from 'react'
import Container from '@mui/material/Container';

export default function Main({children, ...props} : {children: React.ReactNode} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Container sx={{ mt: 2 }} >
    {children}
    </Container>
  )
}
