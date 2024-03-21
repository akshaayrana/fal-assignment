import Title from "@/components/Title";
import Link from "next/link";

interface IUser {
  id: number;
  name: string;
  email: string;
}
const getUsers = async () => {
  try {
    const url = "https://jsonplaceholder.typicode.com/users";
    const res = await fetch(url);
    return await res.json();
  } catch (error) {}
};

const Home = async () => {
  const usersList = await getUsers();
  return (
    <div>
      <Title text="Users" />
      <ul
        role="list"
        className="grid gap-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
      >
        {usersList?.map((user: IUser) => (
          <li className="bg-white p-3 rounded-lg" key={user.id}>
            <Link href={`/albums/${user.id}`} key={user.id} role="user-link">
              <div className="flex items-center gap-x-6">
                <img
                  className="h-16 w-16 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <div className="overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-sm text-indigo-600 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
