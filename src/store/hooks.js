import { useDispatch, useSelector } from 'react-redux';

// Use throughout app instead of plain useDispatch/useSelector
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
