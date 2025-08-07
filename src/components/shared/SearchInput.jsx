import { IconInput } from "./Input";

// export const SearchInput = ({ ...props }) => {
//   const [string, setString] = useState("");
//   const history = useHistory();

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (!string) return;
//     history.push(`/search?q=${string}`);
//     setString("");
//   }
//   return (
//     <form action="/search" onSubmit={handleSubmit}>
//       <IconInput
//         name="q"
//         value={string}
//         onValueChange={setString}
//         icon="search"
//         placeholder="Search"
//         {...props}
//       />
//     </form>
//   );
// };

export const SearchInput = ({ ...props }) => {
  return <IconInput {...props} icon="search" placeholder="Search" />;
};
