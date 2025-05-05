<template>
    <div>
      <h1>{{ products}}</h1>asdsad
    </div>
  </template>
  
  <script setup>
    const {data: products} = await useFetch('https://carclicker.ru/hello/asdads'); 
  </script>
  
  <style scoped>
  h1 {
    background: #f0f0f0;
    padding: 1rem;
    border-radius: 4px;
  }
  </style>
  