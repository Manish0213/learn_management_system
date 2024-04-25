import ChangePassword from "./ChangePassword";
import ChangeProfilePic from "./ChangeProfilePic";
import DeleteProfile from "./DeleteProfile";
import EditProfile from "./EditProfile";


export default function Settings() {
    return (
        <>
            <h1 className="font-inter lg:mt-4 mb-7 lg:mb-14 font-medium text-3xl text-richblack-5">
                Edit Profile
            </h1>
            <ChangeProfilePic />
            <EditProfile/>
            <ChangePassword/>
            <DeleteProfile/>

        </>
    )
}