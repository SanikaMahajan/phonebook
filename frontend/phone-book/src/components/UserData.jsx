const UserData = ({users}) => {

    return (
        <>
        {
            users.map((curUser) => {
                const {id, name, phone_no, email} = curUser;

                return(
                    <tr>
                        <td>{id}</td>
                        <td>{name}</td>
                        <td>{phone_no}</td>
                        <td>{email}</td>
                    </tr>
                )
                
            })
        }
        
        </>

    )
     
}

export default UserData;