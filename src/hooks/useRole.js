import { useContext } from 'react';
import { RoleContext } from '../context/RoleContext';

const useRole = () => {
    const { role, setRole } = useContext(RoleContext);
    return { role, setRole };
};

export default useRole;
