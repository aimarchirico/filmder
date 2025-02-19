const useUser = (supabase: any) => {

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    };
  
  return {
    getUser
  }
}

export default useUser;