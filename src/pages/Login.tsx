import { Button } from "primereact/button";
export default function Login() {
  return (
   <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-1 xl:min-h-[800px]">
    <div className="flex items-center justify-center py-12">
      <Button label="Login"  />
    </div>
  </div>
  );
}