import type {CSSObject} from '@mui/material/styles';

export const HiddenInput: CSSObject = {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
}
export const LogAccountsMUI = {
    Container: {
        m: 2
    },
    TabFlexCenteredContainer: {
        m: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    TabFlexContainer: {
        m: 1,
        display: "flex",
        flexDirection: "column"
    },
    UploadGridContainer: {
        display: "grid",
        gridTemplateColumns: "50% 50%"
    },
    UploadGridCol1: {
        gridColumnStart: 1,
        gridColumnEnd: "span 1"
    },
    UploadGridCol2: {
        gridColumnStart: 2,
        gridColumnEnd: "span 1",
        justifySelf: "center",
        alignSelf: "center",
        overflowX: "scroll",
    },
    UploadButton: {
        width: "100%",
        color: "black",
        borderColor: "darkgray",
    },
    Divider: {
        ml: 1,
        mr: 1,
        mt: 2,
        mb: 2
    }
}