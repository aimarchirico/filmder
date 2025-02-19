'use client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';

export default function Movies() {

    useEffect(() => {
      redirect('/home');
    }, []);

  return (
    <SplashScreen/>
  );
}