export interface IContainer {
    children: React.ReactNode;
}

const Container = (props: IContainer) => {
    const { children } = props;
    return (
        <div style={{ padding: "60px 20px 60px 20px", marginTop: "20px" }}>
            {children}
        </div>
    );
};

export default Container;
