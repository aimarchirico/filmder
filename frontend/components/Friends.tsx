import { FindFriendsProps, FriendsBoxProps } from "@/types/Friends";

export const FriendsBox = ({
  title,
  children,
  className = "",
  height = "h-[400px]",
}: FriendsBoxProps) => {
  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div
        className={`border-secondary border-4 rounded-2xl p-4 w-full md:w-3/4 ${height} min-h-[100px] overflow-y-auto pr-4 flex flex-col scrollbar`}
      >
        {children}
      </div>
    </div>
  );
}

export const FindFriends = ({
  email,
  setEmail,
  onClick,
}: FindFriendsProps) => {
  return <><h2 className="text-2xl font-semibold mt-6 mb-4">Find Friends</h2><div className="p-4 w-full md:w-3/4 flex flex-col">
    <label className="mb-2">E-mail:</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-3 border-2 border-secondary rounded-2xl text-white bg-gray-800 focus:outline-none"
      placeholder="Enter friend's email" />
    <button
      onClick={onClick}
      className="mt-4 px-6 py-3 bg-secondary text-white rounded-2xl hover:bg-purple-700 transition"
    >
      Send Friend Request
    </button>
  </div></>
}


