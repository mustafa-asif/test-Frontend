import { Dialog } from "@mui/material";

export const YoutubeDialog = ({ video, playlist, open, setOpen }) => {
    return (
        <Dialog open={open} fullWidth={true} onClose={() => setOpen(!open)}>
            <div className="video-responsive">
                <iframe
                    src={`https://www.youtube.com/embed/${video}?playlist=${playlist}&autoplay=1&loop=1&rel=0`}
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        </Dialog>
    );
};
