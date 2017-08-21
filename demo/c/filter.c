WASM(
    640 * 480 * 4 * 6,
    void debug(int msg);
)

const int outline_kernel[10] = {
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1,
    1
};

unsigned char clamp(double value)
{
    return (value < 0) ? 0 : (value > 255) ? 255 : (unsigned char)(value);
}


void outline_c(unsigned char* buffer_in, unsigned char* buffer_out, unsigned int width, unsigned int height, double mI, double tresh)
{
    int sum = 0, index = 0, kernelIndex = 0, edgeSum = 0;
    mI /= 255;

    for (int y = 0; y < (int)height; ++y)
    {
        for (int x = 0; x < (int)width; ++x)
        {
            index = y * width + x;

            sum = 
            ((double) buffer_in[index * 4]     * 0.30) +
            ((double) buffer_in[index * 4 + 1] * 0.59) +
            ((double) buffer_in[index * 4 + 2] * 0.11);
        
            kernelIndex = 0;
            edgeSum = 0;

            for (int i = -1; i <= 1; ++i)
            {
                for (int k = -1; k <= 1; ++k)
                {
                    int posX = x + k;
                    int posY = y + i;
                    if (posX >= 0 && posX < width && posY >= 0 && posY < height)
                    {
                        int index = posY * width + posX;
                        edgeSum += (int)buffer_in[index * 4] * (int)outline_kernel[kernelIndex];
                    }
                    kernelIndex += 1;
                }
            }

            unsigned char brn = clamp( sum * mI);
            
            buffer_out[index * 4 + 0] = buffer_out[index * 4 + 1] = (clamp(edgeSum * mI) > tresh && x) ? 255 : brn;
            buffer_out[index * 4 + 2] = brn;
            buffer_out[index * 4 + 3] = 255;
        }
    }
}