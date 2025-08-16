import React, { useState } from 'react'

const UseFetch = (cb) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fn = async(...args) => {
    setLoading(true);
    setError(null);
    try {
        const res = await cb(...args);
        setData(res);
    } catch (error) {
        setError(error);
        
    }finally{
        setLoading(false);
    }
  }
  return {data, fn, loading, error};
}

export default UseFetch;