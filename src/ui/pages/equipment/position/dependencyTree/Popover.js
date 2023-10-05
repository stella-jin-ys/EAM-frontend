import * as React from 'react';
import {Typography, Popover} from "@material-ui/core";

export default function MouseOverPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
      console.log('Hover popover');
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              style={{backgroundColor:"lightBlue"}}
      >
        Hover with a Popover.
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
              <Typography sx={{ p: 1 }} style={{backgroundColor:'red'}}
              >I use Popover.</Typography>
      </Popover>
    </div>
  );
}