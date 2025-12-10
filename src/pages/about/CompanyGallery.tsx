import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCompanyGallery,
  selectCompanyGallery,
} from "../../store/slices/companyGallery.slice";

const CompanyGallery = () => {
  const dispatch = useDispatch<any>();
  const companyGallery = useSelector(selectCompanyGallery);

  useEffect(() => {
    dispatch(getAllCompanyGallery());
  }, [dispatch]);

  return (
    <div className="w-full px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Company Gallery
      </h1>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {companyGallery.map((item: any) => (
          <img
            key={item._id}
            src={item.images[0]}
            className="w-full h-64 object-cover rounded-md shadow"
            alt={item.title}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyGallery;
