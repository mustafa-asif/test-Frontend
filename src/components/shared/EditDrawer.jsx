import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { useBackClose } from "./LastLocation";
import { LoadingView } from "./LoadingView";
import { NotFoundView } from "./NotFoundView";

export const EditDrawer = ({
  EditView,
  model,
  id,
  width = "w-screen sm:w-screen/1.5 lg:w-screen/2",
  ...props
}) => {
  const [isLoading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);

  const fetchDocument = async () => {
    if (!id) return;
    // check local first?
    const { data } = await xFetch(`/${model}/${id}`);
    setLoading(false);
    if (!data) return;
    setDocument(data);
  };

  useEffect(() => {
    if (!props.open) {
      setLoading(true);
      setDocument(null);
    } else if (model && id) {
      fetchDocument();
    }
  }, [props.open, model, id]);

  const handleDrawerClose = useBackClose(`/${props.mainPagePath ? props.mainPagePath: model}`);

  const content = (() => {
    if (!document && isLoading) return <LoadingView />;
    else if (!document) return <NotFoundView />;
    else return <EditView document={document} handleDrawerClose={handleDrawerClose} />;
  })();

  return (
    <Drawer anchor="right" onClose={handleDrawerClose} {...props}>
      <div className={`${width} h-full p-5 sm:p-10`}>{content}</div>
    </Drawer>
  );
};
