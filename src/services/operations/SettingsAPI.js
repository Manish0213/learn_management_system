import toast from "react-hot-toast";
import { settingsEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setLoading, setUser } from "../../slices/profileSlice";
import { setToken } from "../../slices/authSlice";
import { ResetCart } from "../../slices/cartSlice";


const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
    return async(dispatch) => {
        const toastId = toast.loading("loading....")
        try {
            const response = await apiConnector(
                "PUT", 
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                  "Content-Type": "/multipart/form-data",
                  Authorization: `Bearer ${token}`,  
                }
            )
            console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", response)
            if(!response.data.success) {
                throw new Error(response.data.message)
            }
            
            toast.success("Profile Picture Updated Successfully")
            //const userImage = response.data?.user?.image
            dispatch(setUser(response.data.data))
            localStorage.setItem("user", JSON.stringify(response.data.data))
            
        } catch (error) {
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId)
    }
}

export function editProfile(token, formData) {
  return async(dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)
      if(!response.data.success) {
        throw new Error(response.data.message)
      }
      
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      )
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("loading...") 
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE PASSWORD API RESPONSE ----------", response)

    if(!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Password changed successfully")
  } catch (error) {
    console.log("CHANGE PASSWORD API RESPONSE ----------",error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId); 
}


export function deleteAccount(token, navigate) {
    return  async(dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true));
      try {
        const response = await apiConnector("DELETE", DELETE_PROFILE_API, {token, })
        console.log("response..", response);
        if(!response.data.success) {
          throw new Error(response.data.message);
        }
        toast.success("Account Deleted");
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(ResetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/signup")

      } catch (error) {
        console.log("unable to delete account",error);
        toast.error("failed to Delete Account");
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }