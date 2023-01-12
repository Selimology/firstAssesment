# test1M

## The scriptv1 can handle large amount of file, and the search feature works properly.

This is due to the reading through the whole file and processing all of it at the end.

## The scriptv2 can handle upto millions of lines of data, but the search feature isn't implemented yet.

This reads through the file in small batches so it can handle large file sizes
