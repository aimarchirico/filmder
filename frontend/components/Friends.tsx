import { FindFriendsProps, FriendsBoxProps } from "@/types/Friends";

export const FriendsBox = ({
  title,
  children,
  className = "",
  height = "h-[400px]",
}: FriendsBoxProps) => {
  return (
    <div className={`my-4 flex flex-col items-center w-full ${className}`}>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div
        className={`border-secondary border-2 rounded-xl p-3 w-full md:w-[90%] ${height} min-h-[50px] overflow-y-auto flex flex-col scrollbar bg-gray-900 shadow-md`}
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
  return (
    <FriendsBox title="Find Friends" height="auto" className="mb-4">
      <div className="flex flex-col gap-2 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-secondary rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
          placeholder="Enter friend's email" 
        />
        <button
          onClick={onClick}
          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Send Friend Request
        </button>
      </div>
    </FriendsBox>
  );
}


