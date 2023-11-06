import { redirect } from "next/navigation";

const checkAdmin = async() =>{
    const res = await fetch("http://localhost:3000/api/install");
    return res.json();
    // console.log('res', res.formData);
}

const Install =async () => {
    const data = await checkAdmin();
    if(data?.userCount >= 1) {
        // redirect('/auth/login')
    }

  return (
    
    <div>
      <p>install</p>
      
    </div>
  )
}

export default Install