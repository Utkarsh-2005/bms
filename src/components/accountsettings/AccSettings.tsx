import { API } from "@/api";
import { cn } from "@/utils";
import axios from "@/utils/middleware";
import { Avatar } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { MuiTelInput } from "mui-tel-input";
import { FormEvent, useEffect, useState } from "react";

interface UpdateProfile {
  fname: string;
  lname: string;
  email: string;
  countryCode: string | null;
  phone: string | null;
  gender: string;
  displayPic: string;
}

const fetchProfile = async () => {
  const response = await axios.get(API.users.profile);
  return response.data.data;
};

const updateProfile = async (body: UpdateProfile) => {
  const response = await axios.put(API.users.update, body);
  return response.data.data;
};

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.postForm(API.content.upload, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

const AccSettings = () => {
  const queryClient = useQueryClient();
  const { data, isSuccess } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (!data) return;
    setFname(data?.fname);
    setLname(data?.lname);
    setEmail(data?.email);
    setGender(data?.gender);
    setCountry(data?.countryCode);
    setActualPhone(data?.phone);
    setMobile(`${data?.countryCode}${data?.phone}`);
    setProfilePic(data?.displayPic);
  }, [data, isSuccess]);

  const { mutate, isPending: updatePending } = useMutation({
    mutationFn: updateProfile,
    onSettled: async () => {
      setFname("");
      setLname("");
      setEmail("");
      setMobile("");
      // setDob("");
      // setPassword("");
      setGender("");
      return await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
  const { mutate: uploadFileMutation, isPending } = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      setProfilePic(data.contentUrl);
    },
  });
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  // const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [actualPhone, setActualPhone] = useState<string | null>("");
  const [country, setCountry] = useState<string | null>("");

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const formSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      fname,
      lname,
      email,
      countryCode: country,
      phone: actualPhone,
      gender,
      displayPic: profilePic,
    });
  };

  return (
    // flex flex-col sm:items-start 2xl:items-center items-center w-[80vw] mx-[5px] sm:w-[75%] lg:pl-[10%] sm:pl-[5%] bg-white mt-[50px]
    <div className="flex flex-col sm:items-start 2xl:items-center items-center sm:w-[75%] w-full lg:pl-[10%] sm:pl-[5%] mt-[50px] 2xl:justify-center max-h-full">
      <h1 className="text-2xl font-medium my-2">Account Settings</h1>
      <form
        onSubmit={formSubmitHandler}
        className="flex flex-col items-center sm:items-start"
      >
        <h2 className="mt-[20px] text-lg font-medium">Edit Profile</h2>

        <div className="mt-2 flex w-full justify-center">
          <input
            accept="image/*"
            className="hidden"
            id="profilePic"
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                uploadFileMutation(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="profilePic"
            className="relative flex w-fit justify-center gap-2 items-center"
          >
            <Avatar
              src={profilePic || data?.displayPic}
              sx={{ width: 100, height: 100 }}
              className={cn({
                "opacity-60": isPending,
              })}
            />
            {isPending && (
              <Loader2 className="absolute left-8 size-10 animate-spin" />
            )}
            <Pencil className="size-4" />
          </label>
        </div>
        <input
          type="text"
          className="!py-5 w-[80vw] md:max-w-[500px] sm:w-[50vw] my-2 mb-[15px] h-[30px] border-gray-700 focus:outline-[0.25px] focus:placeholder:invisible placeholder:text-black"
          placeholder="First Name"
          autoComplete="name"
          defaultValue={data?.fname}
          value={fname}
          onChange={handleInputChange(setFname)}
        />
        <input
          type="text"
          className="!py-5 w-[80vw] md:max-w-[500px] sm:w-[50vw] my-2 mb-[15px] h-[30px] border-gray-700 focus:outline-[0.25px] focus:placeholder:invisible placeholder:text-black"
          placeholder="Last Name"
          autoComplete="name"
          value={lname}
          defaultValue={data?.lname}
          onChange={handleInputChange(setLname)}
        />
        <input
          type="text"
          className="!py-5 w-[80vw] bg-gray-100 cursor-not-allowed md:max-w-[500px] sm:w-[50vw] my-2 mb-[15px] h-[30px] border-gray-700 focus:outline-[0.25px] focus:placeholder:invisible placeholder:text-black"
          autoComplete="email"
          readOnly
          placeholder="Email Address"
          value={email}
          defaultValue={data?.email}
          onChange={handleInputChange(setEmail)}
        />

        <MuiTelInput
          value={mobile}
          required={true}
          onChange={(v, info) => {
            setMobile(v);
            setActualPhone(info.nationalNumber);
            setCountry(`+${info.countryCallingCode}`);
          }}
          name="phone"
          id="phone"
          autoComplete="cc-number"
          placeholder="Mobile Number"
          defaultCountry="US"
          variant="outlined"
          className="w-[80vw] md:max-w-[500px] sm:w-[50vw]"
        />
        {/* <input */}
        {/*   type="text" */}
        {/*   className="!py-5 w-[80vw] md:max-w-[500px] sm:w-[50vw]  my-2 mb-[15px] h-[30px] border-gray-700 focus:outline-[0.25px] focus:placeholder:invisible placeholder:text-black" */}
        {/*   placeholder="Date of Birth" */}
        {/*   value={dob} */}
        {/*   onChange={handleInputChange(setDob)} */}
        {/* /> */}
        {/* <input */}
        {/*   type="password" */}
        {/*   className="!py-5 w-[80vw] md:max-w-[500px] sm:w-[50vw]   my-2 mb-[15px] h-[30px] border-gray-700 focus:outline-[0.25px] focus:placeholder:invisible placeholder:text-black" */}
        {/*   placeholder="Change Password" */}
        {/*   autoComplete="current-password" */}
        {/*   value={password} */}
        {/*   onChange={handleInputChange(setPassword)} */}
        {/* /> */}
        <div className="flex flex-col items-start mt-1">
          <label className="flex items-center space-x-2 text-md mb-[5px]">
            <input
              type="radio"
              value="male"
              checked={gender === "male"}
              defaultChecked={data?.gender === "male"}
              onChange={handleGenderChange}
              className="form-radio text-black checked:text-black focus:ring-black"
            />
            <span>Male</span>
          </label>
          <label className="flex items-center space-x-2 text-md mb-[5px]">
            <input
              type="radio"
              value="female"
              checked={gender === "female"}
              defaultChecked={data?.gender === "female"}
              onChange={handleGenderChange}
              className="form-radio text-black checked:text-black focus:ring-black"
            />
            <span>Female</span>
          </label>
        </div>
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="flex items-center gap-2 bg-black text-white rounded-md w-fit p-[5px] px-[10px] text-sm mx-auto mt-2 sm:my-0 my-[20px]"
          >
            SAVE CHANGES
            {updatePending && <Loader2 className="size-4 animate-spin" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccSettings;
